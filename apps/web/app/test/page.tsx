"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ShareEntryDialog } from "@/components/share/ShareEntryDialog";

export default function Page() {
    const [open,setOpen] = useState(false)

    return <div>
        <Button onClick={()=>setOpen(true)}>Share</Button>
        <ShareEntryDialog open={open} onClose={() => setOpen(false)}
        onStart={() => {
          console.log("START CLICKED");
          setOpen(false);
        }}>

        </ShareEntryDialog>
    </div>
}