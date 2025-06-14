import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-muted-foreground">
        Please sign in to view your portfolio.
      </div>
    );
  }

  const userId = (session.user as { id: string })?.id;

  const pastEvents = await prisma.attending.findMany({
    where: {
      userId,
      event: {
        markerDisapperingTime: {
          lt: new Date(),
        },
      },
    },
    include: {
      event: true,
    },
    orderBy: {
      event: {
        markerDisapperingTime: "desc",
      },
    },
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-6 py-20 overflow-hidden font-sans">
      <div className="absolute -top-40 -left-32 w-[30rem] h-[30rem] bg-blue-500 rounded-[58%_42%_33%_67%] blur-[160px] opacity-30" />
      <div className="absolute top-1/4 left-[60%] w-[20rem] h-[20rem] bg-purple-400 rounded-[45%_25%_55%_35%] blur-[140px] opacity-25" />
      <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-indigo-300 rounded-[52%_48%_43%_57%] blur-[130px] opacity-20" />
      <div className="absolute top-[70%] left-10 w-72 h-72 bg-pink-300 rounded-[62%_38%_36%_64%] blur-[120px] opacity-25" />

      <div className="max-w-5xl mx-auto relative z-10 text-center mb-20 space-y-6">
        <div className="relative flex justify-center items-center">
          <div className="absolute -inset-1 rounded-full bg-blue-500 blur-2xl opacity-20 group-hover:opacity-30 transition" />
          <Avatar className="w-32 h-32 border-4 border-ring shadow-xl relative z-10">
            <AvatarImage
              src={session.user?.image || ""}
              alt={session.user?.name || ""}
            />
            <AvatarFallback className="text-xl">
              {session.user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-fade-in-up">
          {session.user?.name}
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto animate-fade-in-up delay-150">
          This is your personal portfolio at GEC. A timeline of memories,
          moments, and milestones.
        </p>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        {pastEvents.length === 0 ? (
          <div className="text-center text-muted-foreground text-xl animate-fade-in-up">
            You haven’t attended any events yet. Your journey starts here.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {pastEvents.map((record, index) => (
              <div
                key={index}
                className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-muted p-6 group transition-all duration-100 hover:scale-[1.02]"
              >
                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition">
                  {record.event.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 mb-3 line-clamp-3">
                  {record.event.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Event Link:{" "}
                    </span>
                    <a
                      href={record.event.eventLink}
                      className="text-blue-600 underline hover:text-blue-800 transition"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {record.event.eventLink}
                    </a>
                  </div>
                  {record.event.certificateLink && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Certificate:{" "}
                      </span>
                      <a
                        href={record.event.certificateLink}
                        className="text-green-600 underline hover:text-green-800 transition"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Certificate
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs text-muted-foreground italic">
                  🗓️ {new Date(record.event.time).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
