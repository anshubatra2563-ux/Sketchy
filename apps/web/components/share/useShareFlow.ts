"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"


function generateRoomId() {
    return crypto.randomUUID().slice(0, 8)
}


export function useShareFlow() {
    const router = useRouter()

    const [introOpen, setIntroOpen] = useState(false)
    const [linkOpen, setLinkOpen] = useState(false)

    const [shareLink,setShareLink] = useState("")

    function openIntro() {
        setIntroOpen(true)
    }

    function closeIntro() {
        setIntroOpen(false)
    }

    function closeLink() {
        setLinkOpen(false)
    }

    function startSession() {
        const roomId = generateRoomId()
        const url = `${window.location.origin}/room/${roomId}`
        setShareLink(url)
        setIntroOpen(false)
        setLinkOpen(true)

        router.push(`/room/${roomId}`)
    }

    async function copyLink() {
        if(!shareLink) return;
        await navigator.clipboard.writeText(shareLink)
    }

    return {
        introOpen,
        linkOpen,
        shareLink,
        openIntro,
        closeIntro,
        startSession,
        copyLink
    }
}
