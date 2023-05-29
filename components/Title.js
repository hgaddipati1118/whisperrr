import Link from "next/link";
export default function Title({tailwind}){
    return(
        <Link href = "/">
        <div className = {tailwind + " text-white font-mono w-screen" }>
            Whisperrr
        </div>
        </Link>
    )
}