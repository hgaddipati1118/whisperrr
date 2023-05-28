import Link from "next/link";
export default function Title({tailwind}){
    return(
        <Link href = "/">
        <div className = {tailwind + " text-white font-mono text-6xl text-center" }>
            Whisperrr
        </div>
        </Link>
    )
}