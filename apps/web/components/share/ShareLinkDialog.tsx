"use client"

import { Dialog } from "@/components/ui/Dialog"
import { DialogHeader } from "@/components/ui/DialogHeader"
import { DialogBody } from "@/components/ui/DialogBody"
import { DialogFooter } from "@/components/ui/DialogFooter"
import { Button } from "@/components/ui/Button"
import { useState } from "react"

interface ShareLinkDialogProps {
  open: boolean
  onClose: () => void
  link: string
  onCopy: () => void
  onStop: () => void
}

export function ShareLinkDialog({open,onClose,link,onCopy,onStop}:ShareLinkDialogProps) {
    const [copied,setCopied] = useState(false);

    function handleCopy() {
        onCopy()
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return <Dialog open={open} onClose={onClose} className="w-[520px] p-5">
        <DialogHeader className="text-center text-xl font-semibold text-[#6965db]">
        Live collaboration
      </DialogHeader>
       <DialogBody className="space-y-4">
         <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Link
          </label>

          <div className="flex gap-2">
            <input
              value={link}
              readOnly
              className="flex-1 rounded-md border bg-gray-100 px-3 py-2 text-sm"
            />

            <Button onClick={handleCopy}>
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Share this link to invite others to collaborate in real time.
          Only people with this link can join the session.
        </p>
       </DialogBody>

       <DialogFooter className="justify-center pt-2">
        <Button
          variant="secondary"
          className="bg-red-500 text-white hover:bg-red-600"
          onClick={onStop}
        >
          Stop session
        </Button>
         </DialogFooter>
        </Dialog>
}