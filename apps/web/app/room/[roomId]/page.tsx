import { Canvas } from '@/components/Canvas'

export default async function RoomPage({params} : { params : Promise<{roomId: string}>}) {
    const { roomId } = await params;
    return <Canvas roomId={roomId} />
}