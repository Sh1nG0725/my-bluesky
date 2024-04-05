import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";

export default function MyBlueSkyLogo() {
  return (
    <div className={`flex flex-row items-center leading-none text-white`}>
      <FontAwesomeIcon icon={faDove} className="h-[40px]" color="#ffffff"/>
      <p className="ml-2 text-[44px]">MyBlueSky</p>
    </div>
  );
}
