
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Redo, Download, Share2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MeasurementCardProps {
  measurements: Record<string, number>;
  confidenceScore: number;
  onReset: () => void;
  isEstimated?: boolean;
  userImage?: string;
}

export default function MeasurementCard({
  measurements,
  confidenceScore,
  onReset,
  isEstimated = false,
  userImage
}: MeasurementCardProps) {
  const [measurementSystem, setMeasurementSystem] = useState<"metric" | "imperial">("metric");
  
  const toggleMeasurementSystem = () => {
    setMeasurementSystem(measurementSystem === "metric" ? "imperial" : "metric");
  };
  
  const formatMeasurement = (valueInCm: number) => {
    if (measurementSystem === "imperial") {
      const inches = valueInCm / 2.54;
      const roundedInches = Math.round(inches * 4) / 4;
      return `${roundedInches.toFixed(1)}"`;
    } else {
      return `${valueInCm.toFixed(1)} cm`;
    }
  };
  
  const displayedMeasurements = [
    { name: "Chest", value: measurements.chest },
    { name: "Waist", value: measurements.waist },
    { name: "Hips", value: measurements.hips },
    { name: "Shoulder", value: measurements.shoulder },
    { name: "Inseam", value: measurements.inseam },
    { name: "Sleeve", value: measurements.sleeve }
  ];
  
  const additionalMeasurements = [];
  
  if (measurements.neck) {
    additionalMeasurements.push({ name: "Neck", value: measurements.neck });
  }
  
  if (measurements.thigh) {
    additionalMeasurements.push({ name: "Thigh", value: measurements.thigh });
  }
  
  if (measurements.upperArm) {
    additionalMeasurements.push({ name: "Upper Arm", value: measurements.upperArm });
  }
  
  if (measurements.forearm) {
    additionalMeasurements.push({ name: "Forearm", value: measurements.forearm });
  }
  
  if (measurements.calf) {
    additionalMeasurements.push({ name: "Calf", value: measurements.calf });
  }
  
  if (measurements.neckCircumference) {
    additionalMeasurements.push({ name: "Neck Circumference", value: measurements.neckCircumference });
  }
  
  if (measurements.shoulderWidth) {
    additionalMeasurements.push({ name: "Shoulder Width", value: measurements.shoulderWidth });
  }
  
  const formatHeight = () => {
    if (measurementSystem === "imperial") {
      const totalInches = measurements.height / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    } else {
      return `${measurements.height.toFixed(1)} cm`;
    }
  };
  
  // Helper function to get avatar fallback text
  const getAvatarFallback = () => {
    const gender = measurements.hasOwnProperty('gender') ? String(measurements.gender) : 'U';
    
    if (gender === 'male' || gender === 'Male') return 'M';
    if (gender === 'female' || gender === 'Female') return 'F';
    return 'U';
  };
  
  return (
    <Card className="bg-card border-none shadow-lg text-card-foreground">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            {userImage && (
              <Avatar className="h-14 w-14 border-2 border-electric">
                <AvatarImage src={userImage} alt="User photo" />
                <AvatarFallback className="bg-gray-700 text-white">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
            )}
            <CardTitle className="text-xl font-semibold text-foreground">Your Body Measurements</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleMeasurementSystem}
            className="gap-1 text-xs bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
          >
            <ArrowRight className="h-3 w-3" />
            {measurementSystem === "metric" ? "Imperial" : "Metric"}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          Height: <span className="font-medium text-electric">{formatHeight()}</span>
          {isEstimated && <span className="text-xs text-amber-400">(Estimated)</span>}
        </div>
        
        <div className="flex items-center mt-1 gap-1">
          <div className="h-2 bg-blue-900/50 rounded-full flex-grow">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-electric rounded-full" 
              style={{ width: `${confidenceScore * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{Math.round(confidenceScore * 100)}% accuracy</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {displayedMeasurements.map((item) => (
            <div key={item.name} className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400">{item.name}</div>
              <div className="text-lg font-semibold text-white">{formatMeasurement(item.value)}</div>
            </div>
          ))}
        </div>
        
        {additionalMeasurements.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Advanced Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              {additionalMeasurements.map((item) => (
                <div key={item.name} className="bg-gray-800/70 rounded-lg p-3">
                  <div className="text-xs text-gray-400">{item.name}</div>
                  <div className="text-md font-medium text-white">{formatMeasurement(item.value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Download className="h-3 w-3" />
          Save As PDF
        </Button>
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Share2 className="h-3 w-3" />
          Share
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="ml-auto gap-1 text-xs hover:bg-gray-700"
        >
          <Redo className="h-3 w-3" />
          Scan Again
        </Button>
      </CardFooter>
    </Card>
  );
}

