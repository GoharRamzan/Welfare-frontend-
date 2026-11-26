
import { Users } from "lucide-react";

export default function BeneficiaryStats({ total = 0 }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Total Beneficiaries
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {total}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                        <Users size={22} />
                    </div>
                </div>
            </div>
        </div>
    );
}
