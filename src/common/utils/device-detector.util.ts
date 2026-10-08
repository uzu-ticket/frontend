import { Request } from "express";

export interface ClientDeviceInfo {
  ipAddress: string;
  userAgent: string;
  device: string;
  browser: string;
  os: string;
  location: string;
}

export function parseClientDeviceInfo(req: Request): ClientDeviceInfo {
  const userAgent = (req.headers["user-agent"] as string) || "";
  
  // Extract IP
  const forwarded = req.headers["x-forwarded-for"];
  let ipAddress = "127.0.0.1";
  if (typeof forwarded === "string" && forwarded.length > 0) {
    ipAddress = forwarded.split(",")[0].trim();
  } else if (req.headers["cf-connecting-ip"]) {
    ipAddress = req.headers["cf-connecting-ip"] as string;
  } else if (req.ip) {
    ipAddress = req.ip;
  } else if (req.socket?.remoteAddress) {
    ipAddress = req.socket.remoteAddress;
  }

  // Normalize IPv6 localhost
  if (ipAddress === "::1" || ipAddress === "::ffff:127.0.0.1") {
    ipAddress = "127.0.0.1";
  }

  // Extract OS
  let os = "Unknown OS";
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    os = "iOS";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (/Macintosh|Mac OS X/.test(userAgent)) {
    os = "macOS";
  } else if (/Windows NT 10.0/.test(userAgent)) {
    os = "Windows 11/10";
  } else if (/Windows/.test(userAgent)) {
    os = "Windows";
  } else if (/Linux/.test(userAgent)) {
    os = "Linux";
  }

  // Extract Browser
  let browser = "Unknown Browser";
  if (/Edg\//.test(userAgent)) {
    browser = "Microsoft Edge";
  } else if (/OPR\/|Opera\//.test(userAgent)) {
    browser = "Opera";
  } else if (/Chrome\//.test(userAgent) && !/Chromium\//.test(userAgent)) {
    browser = "Google Chrome";
  } else if (/Firefox\//.test(userAgent)) {
    browser = "Mozilla Firefox";
  } else if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) {
    browser = "Apple Safari";
  }

  // Extract Device
  let device = "Desktop";
  if (/iPad|Tablet/i.test(userAgent)) {
    device = "Tablet";
  } else if (/Mobile|iPhone|Android/i.test(userAgent)) {
    device = "Mobile";
  }

  // Derive location
  let location = "Lagos, Nigeria";
  const cfCity = req.headers["cf-ipcity"] as string;
  const cfCountry = req.headers["cf-ipcountry"] as string;
  if (cfCity && cfCountry) {
    location = `${cfCity}, ${cfCountry}`;
  } else if (
    ipAddress === "127.0.0.1" ||
    ipAddress.startsWith("192.168.") ||
    ipAddress.startsWith("10.") ||
    ipAddress.startsWith("172.")
  ) {
    location = "Lagos, Nigeria (Local)";
  }

  return {
    ipAddress,
    userAgent,
    device,
    browser,
    os,
    location,
  };
}
