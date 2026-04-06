import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Stack, Text, Alert } from "@chakra-ui/react";
import { loginUser } from "../../services/auth-service"; // Проверь путь к файлу!

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Очищаем старые ошибки

        try {
            // Пытаемся залогиниться
            await loginUser({ email, password });
            // Если всё ок, перекидываем юзера на страницу с альбомами
            navigate("/albums");
        } catch (err: any) {
            // Если охранник не пустил — показываем ошибку
            setError(err.response?.data?.error || "Ошибка при входе");
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

                    {/* Показываем ошибку, если она есть */}
                    {error && (
                        <Text color="red.500" fontSize="sm">{error}</Text>
                    )}

                    <Button type="submit" colorScheme="blue" width="full">
                        Войти
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default LoginPage;