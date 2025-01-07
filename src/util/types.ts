import z from "zod";

export const LeaseSchema = z.object({
    lease_id: z.number(),
    unit_id: z.number(),
    tenant_id: z.number(),
    start_date: z.string(),
    end_date: z.string(),
});

export type Lease = z.infer<typeof LeaseSchema>;

export const UnitSchema = z.object({
    unit_id: z.number(),
    property_id: z.number(),
    unit_number: z.string(),
    size: z.number(),
    type: z.string(),
});

export type Unit = z.infer<typeof UnitSchema>;

export const PropertySchema = z.object({
    property_id: z.number(),
    property_name: z.string(),
    address: z.string(),
});

export type Property = z.infer<typeof PropertySchema>;

export type UnitWithVacancy = { 
    unit_id: number;
    vacancy_days: number;
 };


export type ExpiringLeasesReturnType = {
    property_id: number;
    expiring_leases: Lease[]
}
