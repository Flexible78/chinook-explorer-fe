import { useState } from "react";
import type { FormEvent } from "react";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { loginUser } from "../../services/auth-service";
import { useAuthStore } from "../../state-management/auth-store";

interface LoginErrorResponse {
    error?: string;
}

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            await loginUser({ email, password });

            // Умный редирект по роли
            const role = useAuthStore.getState().role;
            if (role === "SALE") {
                navigate("/customers");
            } else {
                navigate("/albums");
            }
        } catch (err) {
            const loginError = err as AxiosError<LoginErrorResponse>;
            setError(loginError.response?.data?.error ?? "Ошибка при входе");
        }
    };

    return (
        <Box maxW="sm" mx="auto" mt="20vh" p="6" borderWidth="1px" borderRadius="md" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="6">
                Вход в Chinook 🎸
            </Text>

            <form onSubmit={handleLogin}>
                <Stack gap="4">
                    <Input
                        placeholder="Email (например: user@test.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Пароль (123)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <Text color="red.500" fontSize="sm">{error}</Text>
                    )}

                    <Button type="submit" colorPalette="blue" width="full">
                        Войти
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default LoginPage;