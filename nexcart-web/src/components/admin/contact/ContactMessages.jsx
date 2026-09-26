import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await api.get("/admin/contact-messages");

                setMessages(data);
            } catch (error) {
                console.log(error);
                setError(
                    error?.response?.data?.message ||
                    "Failed to fetch contact messages"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <p className="text-gray-600">Loading contact messages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Contact Messages
                </h1>
                <p className="text-gray-500 mt-1">
                    View messages submitted through the contact form.
                </p>
            </div>

            {messages.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">
                        No contact messages found.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Message
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {messages.map((message) => (
                                <tr key={message.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {message.id}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {message.name}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {message.email}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                                        {message.message}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {message.createdAt
                                            ? new Date(message.createdAt).toLocaleString()
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;