"use client"

import { useState,useEffect } from "react"
import { useRouter,useSearchParams } from "next/navigation"


function generateRoomId() {
    return crypto.randomUUID().slice(0, 8)
}


export function useShareFlow(roomId?: string) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [introOpen, setIntroOpen] = useState(false)
    const [linkOpen, setLinkOpen] = useState(false)

    const [shareLink, setShareLink] = useState("")

    useEffect(() => {
        if (roomId && typeof window !== 'undefined') {
            setShareLink(`${window.location.origin}/room/${roomId}`)
        } else {
            setShareLink("")
        }
    }, [roomId])

    useEffect(() => {
        // Check if URL has ?openShare=true parameter
        const shouldAutoOpen = searchParams?.get('openShare') === 'true'
        
        if (shouldAutoOpen && roomId && shareLink) {
            // Open the link dialog
            setLinkOpen(true)
            
            // Clean up the URL parameter (remove ?openShare=true)
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href)
                url.searchParams.delete('openShare')
                window.history.replaceState({}, '', url.toString())
            }
        }
    }, [roomId, shareLink, searchParams])
    function openIntro() {
        setIntroOpen(true)
    }

    function closeIntro() {
        setIntroOpen(false)
    }

    function openLink() {
        setLinkOpen(true)
    }

    function closeLink() {
        setLinkOpen(false)
    }

    function handleShareClick() {
        if(roomId) {
            openLink()
        }else {
            openIntro()
        }
    }
    function startSession() {
        const roomId = generateRoomId()
        // const url = `${window.location.origin}/room/${roomId}`
        // setShareLink(url)
        setIntroOpen(false)
        //setLinkOpen(true)

        router.push(`/room/${roomId}?openShare=true`)
    }
    function stopSession() {
        setLinkOpen(false)
        setShareLink("")
        router.push(`/`)
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
        stopSession,
        copyLink,
        openLink,
        closeLink,
        handleShareClick
    }
}
