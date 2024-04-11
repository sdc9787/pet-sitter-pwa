import { motion } from "framer-motion";
type MotionComponentProps = {
  children: React.ReactNode;
};

const MotionComponent: React.FC<MotionComponentProps> = ({ children }) => {
  return (
    <motion.div className="page" initial={{ y: "5%", opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%" }} transition={{ duration: 0.15 }}>
      {children}
    </motion.div>
  );
};

export default MotionComponent;
