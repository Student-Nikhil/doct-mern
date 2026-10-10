import { FaHeartbeat, FaBrain, FaBone, FaBaby, FaTooth, FaEye, FaStethoscope, FaLungs, FaUserMd } from 'react-icons/fa';

const map = { heart: FaHeartbeat, brain: FaBrain, bone: FaBone, baby: FaBaby, tooth: FaTooth, eye: FaEye, lungs: FaLungs, stethoscope: FaStethoscope, skin: FaUserMd };
export default function ServiceIcon({ name, className = '' }) {
  const Icon = map[name] || FaStethoscope;
  return <Icon className={className} />;
}
