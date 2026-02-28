import { User } from "@prisma/client";
import Tools from "../Tools";
import FriendRequests from "./FriendRequests";
import UserInfoCard from "./UserInfoCard";
import UserMediaCard from "./UserMediaCard";
import { Suspense } from "react";
import Friends from "./Friends";

const RightMenu = ({ user }: { user?: User }) => {
    return (
        <div className="flex flex-col gap-6">
            {user ? (
                <>
                    <Suspense fallback="loading...">
                        <UserInfoCard user={user} />
                    </Suspense>
                    <Suspense fallback="loading...">
                        <UserMediaCard user={user} />
                    </Suspense>
                </>
            ) : null}
            <FriendRequests />
            <Friends />
            <Tools size="md" />
        </div>
    );
};

export default RightMenu;
