import Post from "./Post";

const Feed=({username}:{username?:string})=>{
    return(
        <div className="p-4 bg-white shadow-md border-lg flex flex-col gap-12">
           <Post/>
           <Post/>
           <Post/>
           <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
            <Post/>
        </div>
    )
}
export default Feed
