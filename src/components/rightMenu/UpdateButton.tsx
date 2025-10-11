"use client"

import {useFormStatus} from "react-dom";

const UpdateButton=()=>{

    const {pending} = useFormStatus()

    return(
        <button className="bg-blue-500 p-2 mt-2 rounded-md text-white disabled:bg-opacity-50 disabled:cursor-not-allowed"
                disabled={pending}
        >
            {pending ? "更新中..." : "更新"}
        </button>
    )
}
export default UpdateButton
