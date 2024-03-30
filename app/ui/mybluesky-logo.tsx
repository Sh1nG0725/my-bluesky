import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default function MyBlueSkyLogo() {
  return (
    <div className={`flex flex-row items-center leading-none text-white`}>
      <FontAwesomeIcon icon={faPaperPlane} className="h-[60px]" color="#ffffff"/>
      <p className="text-[44px]">MyBlueSky</p>
    </div>
  );
}
