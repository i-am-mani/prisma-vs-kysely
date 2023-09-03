import "./globals.css";
import { UserTableSection } from "./components/UserTableSection";
import "react18-json-view/src/style.css";
import { PostsTableSection } from "./components/PostsTableSection";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl">Prisma vs Kysely</h1>
      <div className="py-10">
        <UserTableSection />
        <PostsTableSection />
      </div>
    </main>
  );
}
