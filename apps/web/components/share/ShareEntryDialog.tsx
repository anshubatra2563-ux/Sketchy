"use client"

import { Dialog } from "@/components/ui/Dialog"
import { DialogHeader } from "@/components/ui/DialogHeader"
import { DialogBody } from "@/components/ui/DialogBody"
import { DialogFooter } from "@/components/ui/DialogFooter"
import { Button } from "@/components/ui/Button"

interface ShareEntryDialogProps {
  open: boolean
  onClose: () => void
  onStart: () => void
}

export function ShareEntryDialog({
  open,
  onClose,
  onStart,
}: ShareEntryDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="w-[420px] h-auto" 
    >
      <DialogHeader className="text-center text-xl font-semibold text-[#6965db] pb-1">
        Live collaboration
      </DialogHeader>

      <DialogBody className="text-center space-y-2 px-2">
        <p className="text-sm text-gray-600">
          Invite people to collaborate on your drawing in real-time.
        </p>

        <p className="text-sm text-gray-500">
          A private session link will be generated and shared.
        </p>
      </DialogBody>

      <DialogFooter className="justify-center pt-2">
        <Button size="lg" onClick={onStart}>
          Start Session
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
