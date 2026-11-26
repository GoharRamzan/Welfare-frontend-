
import { labelClass } from "./applicationUtils";

export default function FormField({
    label,
    children,
    className = "",
}) {
    return (
        <div className={className}>
            <label className={labelClass}>{label}</label>
            {children}
        </div>
    );
}
