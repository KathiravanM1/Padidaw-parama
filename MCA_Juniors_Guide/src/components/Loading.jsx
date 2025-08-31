import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function Loading({ message = "Loading..." }) {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-4"
                >
                    <GraduationCap className="w-12 h-12 text-gray-600" />
                </motion.div>
                <p className="text-gray-600 font-medium">{message}</p>
            </motion.div>
        </div>
    );
}