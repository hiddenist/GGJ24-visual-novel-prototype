import { SVGAttributes } from "react"

export const FastForwardIcon: React.FC<SVGAttributes<SVGElement>> = ({ className, ...rest}) => {
    return (
        <svg viewBox="0 0 24 24" className={`next icon ${className ?? ""}`} {...rest}><path d="m4 18 8.5-6L4 6zm9-12v12l8.5-6z" fill="currentColor"></path></svg>
    )
}