import _ from "lodash";
import {
    Lease,
    LeaseSchema,
    Property,
    PropertySchema,
    Unit,
    UnitSchema,
} from "../util/types";
import { CsvUtils } from "../util/csvUtils";

export class CsvService {
    public async getLeases(): Promise<Lease[]> {
        return await CsvUtils.readFile<Lease>("data/leases.csv", LeaseSchema);
    }

    public async getUnits(): Promise<Unit[]> {
        return await CsvUtils.readFile<Unit>("data/units.csv", UnitSchema);
    }

    public async getProperties(): Promise<Property[]> {
        return await CsvUtils.readFile<Property>(
            "data/properties.csv",
            PropertySchema
        );
    }
}
