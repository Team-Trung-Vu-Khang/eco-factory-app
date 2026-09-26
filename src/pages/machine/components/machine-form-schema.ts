import { z } from "zod";
import { EMPTY_MACHINE, machineSchema } from "@/features/factory";

export const machineFormSchema = machineSchema.extend({ factoryId: z.string().min(1, "Trường này là bắt buộc.") });
export type MachineDialogValues = z.infer<typeof machineFormSchema>;
export const EMPTY_MACHINE_DIALOG: MachineDialogValues = { ...EMPTY_MACHINE, factoryId: "" };
