
export default function PulseLoader(){
    return(
            <div className="flex justify-center p-1 items-center rounded-[50%] bg-[#eaeaea] relative anim-pulse">
                <img alt="Blacvolta logo"
                    className="invert relative z-100 object-contain  aspect-[1/1]" 
                    width={50} height={50} src="/assets/images/logo.png"
                />
            </div>
    )
}