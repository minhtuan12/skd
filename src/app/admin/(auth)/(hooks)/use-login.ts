import {useMutation} from "@tanstack/react-query";

export function useLogin() {
    return useMutation({
        mutationFn: async (data: { username: string; password: string }) => {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw await res.text();
            }

            return res.json();
        },
    });
}
