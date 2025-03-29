import { useSearchParams } from "@remix-run/react";

export default function SignUpSent() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    
    return (
        <div>激活邮件已发送到 {email}</div>
    )
}
