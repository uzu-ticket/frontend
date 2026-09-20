import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import { useOrgState } from "~/composables/useOrgState";
import type { Customer, CustomerPurchase } from "~/types/customers";

interface ApiCustomer {
  id: string;
  customerId?: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  orders?: number;
  status: string;
  city?: string | null;
  location?: string;
  createdAt?: string;
  customerSince?: string;
  lastLoginAt?: string | null;
  lastActive?: string;
  purchases?: Array<{
    id: string;
    createdAt: string;
    status: string;
    totalMinor: string | number | bigint;
    event?: { title?: string };
    _count?: { tickets: number };
  }>;
}

function unwrap<T>(value: { data?: T } | T): T {
  return (value as { data?: T })?.data ?? (value as T);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function mapCustomer(raw: ApiCustomer): Customer {
  const name = raw.name ?? raw.fullName ?? raw.email;
  return {
    id: raw.id,
    customerId: raw.customerId ?? `CUST-${raw.id.slice(0, 8).toUpperCase()}`,
    initials: initials(name),
    avatarColor: "#3FD246",
    name,
    email: raw.email,
    phone: raw.phone ?? "",
    orders: raw.orders ?? raw.purchases?.length ?? 0,
    status:
      raw.status === "Active" || raw.status === "active"
        ? "Active"
        : "Inactive",
    location: raw.location ?? raw.city ?? "",
    lastActive: raw.lastActive ?? raw.lastLoginAt ?? undefined,
    customerSince: raw.customerSince ?? raw.createdAt,
  };
}

export function useCustomers() {
  const { instance } = useApi();
  const { activeOrgId } = useOrgState();
  const customers = useState<Customer[]>("customers:list", () => []);
  const stats = useState("customers:stats", () => ({
    total: 0,
    activeLast30Days: 0,
    newLast30Days: 0,
    duplicateUsed: 0,
  }));
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCustomers() {
    if (!activeOrgId.value) return customers.value;
    loading.value = true;
    error.value = null;
    try {
      const [listResponse, statsResponse] = await Promise.all([
        instance.get(`/organisations/${activeOrgId.value}/customers`),
        instance.get(`/organisations/${activeOrgId.value}/customers/stats`),
      ]);
      customers.value = (unwrap(listResponse.data) as ApiCustomer[]).map(
        mapCustomer,
      );
      stats.value = unwrap(statsResponse.data);
      return customers.value;
    } catch (cause) {
      error.value = "Failed to load customers";
      throw cause;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCustomer(customerId: string) {
    if (!activeOrgId.value) throw new Error("Select an organisation first");
    const response = await instance.get(
      `/organisations/${activeOrgId.value}/customers/${customerId}`,
    );
    const raw = unwrap(response.data) as ApiCustomer;
    return {
      customer: mapCustomer(raw),
      purchases: (raw.purchases ?? []).map<CustomerPurchase>((purchase) => ({
        id: purchase.id,
        event: purchase.event?.title ?? "Ticket purchase",
        orderId: purchase.id,
        date: new Date(purchase.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        tickets: purchase._count?.tickets ?? 0,
        amount: Number(purchase.totalMinor) / 100,
        status:
          purchase.status === "paid"
            ? "Completed"
            : purchase.status === "cancelled"
              ? "Cancelled"
              : purchase.status === "refunded"
                ? "Refunded"
                : "Pending",
      })),
    };
  }

  async function setStatus(customerId: string, active: boolean) {
    if (!activeOrgId.value) throw new Error("Select an organisation first");
    const action = active ? "activate" : "deactivate";
    const response = await instance.post(
      `/organisations/${activeOrgId.value}/customers/${customerId}/${action}`,
    );
    const updated = mapCustomer(unwrap(response.data) as ApiCustomer);
    const index = customers.value.findIndex(
      (customer) => customer.id === customerId,
    );
    if (index >= 0) customers.value[index] = updated;
    return updated;
  }

  return {
    customers,
    stats,
    loading,
    error,
    fetchCustomers,
    fetchCustomer,
    setStatus,
  };
}
