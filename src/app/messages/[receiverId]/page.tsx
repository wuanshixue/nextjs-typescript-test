import Chat from "@/components/Chat";
import { getUser } from "@/lib/actions";
import { notFound } from "next/navigation";

const MessagePage = async ({ params }: { params: { receiverId: string } }) => {
  const receiver = await getUser(params.receiverId);

  if (!receiver) {
    notFound();
  }

  return <Chat receiver={receiver} />;
};

export default MessagePage;
