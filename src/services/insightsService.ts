import { CsvUtils } from "../util/csvUtils";
import {
    ExpiringLeasesReturnType,
    Lease,
    Property,
    Unit,
    UnitWithVacancy,
} from "../util/types";
import { CsvService } from "./csvService";
import _, { Dictionary } from "lodash";

export class InsightsService {
    private readonly DAY_IN_MILLIS = 24 * 60 * 60 * 1000;
    private readonly THIRTY_DAYS = 30 * this.DAY_IN_MILLIS;
    private readonly YEAR = 365 * this.DAY_IN_MILLIS;

    constructor(private readonly filesService: CsvService) {
        this.filesService = filesService;
    }

    public async getExpiringLeases(): Promise<ExpiringLeasesReturnType[]> {
        const leases = await this.getExpiringLeasesNext30Days();
        const units = await this.filesService.getUnits();
        const properties = await this.filesService.getProperties();
        const joinedLeasesAndUnits: (Lease & Unit)[] = CsvUtils.joinByKey(
            leases,
            units,
            "unit_id",
            "unit_id"
        );
        const joinedLeasesAndProperties: (Lease & Unit & Property)[] =
            CsvUtils.joinByKey(
                joinedLeasesAndUnits,
                properties,
                "property_id",
                "property_id"
            );
        const groupedByPropertyId = _.groupBy(
            joinedLeasesAndProperties,
            "property_id"
        );
        const propertiesToLease = _(groupedByPropertyId)
            .map((leases, property_id) => ({
                property_id: parseInt(property_id),
                expiring_leases: leases.map((lease) =>
                    _.pick(lease, [
                        "lease_id",
                        "unit_id",
                        "tenant_id",
                        "start_date",
                        "end_date",
                    ])
                ),
            }))
            .value();
        return propertiesToLease;
    }

    private async getExpiringLeasesNext30Days(): Promise<Lease[]> {
        const leases: Lease[] = await this.filesService.getLeases();
        const now = new Date();
        return _.filter(leases, (lease: Lease) => {
            const endDate = new Date(lease.end_date);
            const difference = endDate.getTime() - now.getTime();
            return difference <= this.THIRTY_DAYS && difference >= 0;
        });
    }

    public async getExtremeVacancy(): Promise<UnitWithVacancy[]> {
        const lastYearLeases = await this.getLastYearLeases();
        const groupedLeasesByUnitId: Dictionary<Lease[]> =
            this.groupAndSortLeases(lastYearLeases);
        const top5LeasesByUnitId: UnitWithVacancy[] =
            this.getTopUnitsByVacancies(groupedLeasesByUnitId, 5);
        const units = await this.filesService.getUnits();
        const unitsWithVacancy = _.map(top5LeasesByUnitId, (vacancy) => {
            const unit = _.find(
                units,
                (unit) => unit.unit_id === vacancy.unit_id
            );
            return {
                ...vacancy,
                ...unit,
            };
        });
        return unitsWithVacancy;
    }

    private async getLastYearLeases(): Promise<Lease[]> {
        const leases: Lease[] = await this.filesService.getLeases();
        const now = new Date();
        return _.filter(leases, (lease: Lease) => {
            const endDate = new Date(lease.end_date);
            const difference = now.getTime() - endDate.getTime();
            return difference >= 0 && difference <= this.YEAR;
        });
    }

    private groupAndSortLeases(leases: Lease[]): Dictionary<Lease[]> {
        return _.mapValues(_.groupBy(leases, "unit_id"), (unitLeases) =>
            _.orderBy(unitLeases, "start_date")
        );
    }

    private getTopUnitsByVacancies(
        leasesByUnit: Dictionary<Lease[]>,
        top: number
    ): UnitWithVacancy[] {
        const vacanciesSum = new Map();
        for (const [unit, leases] of Object.entries(leasesByUnit)) {
            if (leases.length > 2) {
                let sumOfVacancies = 0;
                for (let i = 1; i < leases.length - 1; i++) {
                    const timeGap =
                        new Date(leases[i + 1].start_date).getTime() -
                        new Date(leases[i].end_date).getTime();
                    if (timeGap > this.THIRTY_DAYS) {
                        sumOfVacancies += Math.floor(
                            timeGap / this.DAY_IN_MILLIS
                        );
                    }
                }
                if (sumOfVacancies > 0) {
                    vacanciesSum.set(unit, sumOfVacancies);
                }
            }
        }
        return Array.from(vacanciesSum)
            .sort(([, a], [, b]) => b - a)
            .slice(0, top)
            .map(
                ([unit_id, vacancy_days]): UnitWithVacancy => ({
                    unit_id: parseInt(unit_id),
                    vacancy_days,
                })
            );
    }
}
