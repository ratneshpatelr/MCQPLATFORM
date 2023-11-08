import OpenEnded from "@/components/OpenEnded";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const openEndedPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      Question: {
        select: {
          id: true,
          question: true,
          answer: true
        },
      },
    },
  });
  if (!game || game.gameType !== "open_ended") {
    return redirect("/open_ended");
  }
  return <OpenEnded game={game} />;
};

export default openEndedPage;