import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';
import twoFactorService from '../../services/twoFactorService';

const TwoFactorSetup = ({ onClose, onSuccess }) => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [token, setToken] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setupTwoFactor();
  }, []);

  const setupTwoFactor = async () => {
    setIsLoading(true);
    try {
      await twoFactorService.simulateNetworkDelay();
      const secretData = twoFactorService.generateSecret('usuario@gameswap.com');
      const qrCodeData = await twoFactorService.generateQRCode(secretData.otpauth_url);
      const backupCodesData = twoFactorService.generateBackupCodes();
      setQrCode(qrCodeData);
      setSecret(secretData.base32);
      setBackupCodes(backupCodesData);
    } catch (error) {
      toast.error('Erro ao configurar 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const activateTwoFactor = async () => {
    if (!token || token.length !== 6) {
      toast.error('Digite um código de 6 dígitos');
      return;
    }
    setIsLoading(true);
    try {
      await twoFactorService.simulateNetworkDelay();
      const isValid = twoFactorService.verifyToken(token);
      if (isValid) {
        twoFactorService.activate2FA();
        toast.success('2FA ativado com sucesso!');
        setStep(3);
        if (onSuccess) onSuccess();
      } else {
        toast.error('Código inválido. Verifique e tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao ativar 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setToken(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-blue-500 rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Configurar 2FA</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Carregando...</p>
          </div>
        )}
        {!isLoading && step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Passo 1: Escaneie o QR Code
              </h3>
              <p className="text-gray-300 text-sm">
                Abra seu aplicativo autenticador e escaneie o código abaixo:
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                <QRCode value={qrCode} size={200} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Ou digite manualmente:</p>
              <div className="bg-gray-800 px-4 py-3 rounded-lg">
                <code className="text-blue-400 text-sm font-mono break-all">
                  {secret}
                </code>
              </div>
            </div>
            <div className="bg-blue-900 border border-blue-500 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">Aplicativos Recomendados:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Google Authenticator</li>
                <li>• Microsoft Authenticator</li>
                <li>• Authy</li>
                <li>• 1Password</li>
              </ul>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Próximo
            </button>
          </div>
        )}
        {!isLoading && step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Passo 2: Verificar Código
              </h3>
              <p className="text-gray-300 text-sm">
                Digite o código de 6 dígitos do seu aplicativo:
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={token}
                onChange={handleTokenChange}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
                autoFocus
              />
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  O código muda a cada 30 segundos
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={activateTwoFactor}
                disabled={token.length !== 6}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Ativar 2FA
              </button>
            </div>
          </div>
        )}
        {!isLoading && step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-green-400 text-6xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-green-400">2FA Ativado!</h3>
              <p className="text-gray-300">
                Sua conta agora está protegida com autenticação de dois fatores.
              </p>
            </div>
            <div className="bg-gray-800 border border-yellow-500 rounded-lg p-4">
              <h4 className="font-bold text-yellow-400 mb-3">⚠️ Códigos de Backup</h4>
              <p className="text-sm text-gray-300 mb-4">
                Guarde estes códigos em local seguro. Use-os se perder acesso ao seu autenticador:
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-gray-700 px-3 py-2 rounded text-sm font-mono text-center">
                    {code}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join('\n'));
                  toast.success('Códigos copiados!');
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Copiar Códigos
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup; 