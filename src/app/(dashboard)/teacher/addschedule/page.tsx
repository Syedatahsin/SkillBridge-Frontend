import { userService } from "@/Serveraction/cookiesaction";
export default async function Dashboard() {
  const { data: session, error } = await userService.getSession();

  if (error || !session) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {session.user.role}</div>;
}