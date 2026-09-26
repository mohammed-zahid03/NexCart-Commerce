import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                const response = await api.get("/admin/audit-logs");
                setLogs(response.data);
            } catch (err) {
                console.error("Failed to fetch audit logs:", err);
                setError("Failed to load audit logs.");
            } finally {
                setLoading(false);
            }
        };

        fetchAuditLogs();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Audit Logs
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Track important administrative and seller actions.
                </p>
            </div>

            {loading && (
                <div className="bg-white rounded-lg shadow p-6">
                    Loading audit logs...
                </div>
            )}

            {error && (
                <div className="bg-white rounded-lg shadow p-6 text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    {logs.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                            No audit logs found.
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b bg-slate-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Date/Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Action
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Entity
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Description
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Performed By
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((log) => (
                                    <tr
                                        key={log.auditLogId}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                                            {log.action}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                            {log.entityType} #{log.entityId}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {log.description}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                            {log.performedBy}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AuditLogs;