import { BadGatewayException, Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { AppConfigService } from "../../config/app-config.service";
import { isValidCacNumber, normalizeCacNumber } from "../../common/cac/cac-number";

const CAC_SEARCH_PATH = "/api/company/lookup";

type UnknownRecord = Record<string, unknown>;

@Injectable()
export class CacService {
  private readonly http: AxiosInstance;

  constructor(config: AppConfigService) {
    this.http = axios.create({
      baseURL: config.boucloudApiBaseUrl,
      timeout: 10_000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        ...(config.boucloudApiToken ? { Authorization: `Bearer ${config.boucloudApiToken}` } : {}),
      },
    });
  }

  async search(searchTerm: string) {
    const normalized = normalizeCacNumber(searchTerm);
    if (!isValidCacNumber(normalized)) {
      return {
        found: false,
        searchTerm: normalized,
        message: "Enter a valid CAC number, for example RC1234567.",
      };
    }

    if (!normalized.startsWith("RC")) {
      return {
        found: false,
        searchTerm: normalized,
        message: "This CAC lookup currently supports RC numbers only.",
      };
    }

    try {
      const response = await this.http.post(CAC_SEARCH_PATH, {
        rc_number: normalized.replace(/^RC/, ""),
      });
      const record = this.findRegistrationRecord(response.data);

      return {
        found: Boolean(record),
        searchTerm: normalized,
        registrationNumber: normalized,
        businessName: record ? this.getBusinessName(record) : undefined,
        data: record ?? undefined,
      };
    } catch (error) {
      const upstreamMessage = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      throw new BadGatewayException(upstreamMessage || "CAC search is temporarily unavailable. Please try again.");
    }
  }

  private findRegistrationRecord(value: unknown): UnknownRecord | null {
    if (Array.isArray(value)) {
      for (const item of value) {
        const result = this.findRegistrationRecord(item);
        if (result) return result;
      }
      return null;
    }

    if (!value || typeof value !== "object") return null;
    const record = value as UnknownRecord;
    const hasName = [
      "businessName",
      "business_name",
      "companyName",
      "company_name",
      "approvedName",
      "approved_name",
      "entityName",
      "entity_name",
      "name",
    ].some((key) => typeof record[key] === "string" && record[key]);
    if (hasName) return record;

    for (const nested of Object.values(record)) {
      const result = this.findRegistrationRecord(nested);
      if (result) return result;
    }
    return null;
  }

  private getBusinessName(record: UnknownRecord): string | undefined {
    for (const key of [
      "businessName",
      "business_name",
      "companyName",
      "company_name",
      "approvedName",
      "approved_name",
      "entityName",
      "entity_name",
      "name",
    ]) {
      if (typeof record[key] === "string" && record[key]) return record[key];
    }
    return undefined;
  }
}
