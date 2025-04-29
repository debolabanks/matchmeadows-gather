
import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldX, AlertCircle, RefreshCw } from "lucide-react";
import { verifyAppAssets, CRITICAL_ASSETS } from '@/services/monitoringService';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

interface StatusProps {
  showDetails?: boolean;
}

const SystemStatusMonitor = ({ showDetails = false }: StatusProps) => {
  const [assetStatus, setAssetStatus] = useState<{
    checking: boolean;
    success: boolean;
    failedAssets: string[];
  }>({
    checking: true,
    success: true,
    failedAssets: [],
  });

  const checkAssets = async () => {
    setAssetStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const result = await verifyAppAssets();
      setAssetStatus({
        checking: false,
        success: result.success,
        failedAssets: result.failedAssets,
      });
    } catch (error) {
      setAssetStatus({
        checking: false,
        success: false,
        failedAssets: ['Error checking assets'],
      });
    }
  };

  useEffect(() => {
    checkAssets();
  }, []);

  if (!showDetails) {
    return (
      <div className="flex items-center gap-1">
        {assetStatus.checking ? (
          <RefreshCw className="animate-spin h-4 w-4 text-yellow-500" />
        ) : assetStatus.success ? (
          <ShieldCheck className="h-4 w-4 text-green-500" />
        ) : (
          <ShieldX className="h-4 w-4 text-red-500" />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Shield className="h-5 w-5" />
          System Status
        </h3>
        <Button
          variant="outline" 
          size="sm"
          onClick={checkAssets}
          disabled={assetStatus.checking}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${assetStatus.checking ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Critical Assets</span>
          {assetStatus.checking ? (
            <span className="text-yellow-500 flex items-center gap-1">
              <RefreshCw className="animate-spin h-4 w-4" />
              Checking...
            </span>
          ) : assetStatus.success ? (
            <span className="text-green-500 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              All loaded
            </span>
          ) : (
            <span className="text-red-500 flex items-center gap-1">
              <ShieldX className="h-4 w-4" />
              Issues detected
            </span>
          )}
        </div>

        {!assetStatus.success && assetStatus.failedAssets.length > 0 && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load assets</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 text-sm mt-2">
                {assetStatus.failedAssets.map((asset, index) => (
                  <li key={index}>{asset}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {!assetStatus.checking && assetStatus.success && (
          <div className="text-sm text-gray-500">
            <p>Successfully verified {CRITICAL_ASSETS.length} assets</p>
            <p className="text-xs mt-1">Last checked: {new Date().toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatusMonitor;
