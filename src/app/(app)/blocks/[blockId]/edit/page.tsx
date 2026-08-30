import { redirect } from "next/navigation";

/**
 * The block editor used to be its own screen. It now lives inside the lesson
 * flow as a mode, so any old link lands where the editor actually is.
 */
export default function EditBlockRedirect() {
  redirect("/curriculum/flow");
}
