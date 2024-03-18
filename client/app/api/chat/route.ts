// export const dynamic = "force-dynamic"; // defaults to auto
import { prisma } from "@/lib/db-connection/prisma";

export async function GET(request: Request) {
    try {
        const rooms = await prisma.room.findMany({ where: { status: "waiting" } });
        let selectedRoom;
        if (rooms.length > 0) {
            const randomIndex = Math.floor(Math.random() * rooms.length);
            selectedRoom = rooms[randomIndex];
        } else {
            // If no waiting rooms exist, create a new one
            selectedRoom = await prisma.room.create({
                data: {
                    status: "waiting"
                }
            });
        }

        console.log(rooms);
        return Response.json({ message: `hello from room ${selectedRoom.room_id}` });
    } catch (error) {
        console.error(error);
        return new Response(`error: ${error.message}`, {
            status: 500
        });
    }
}
