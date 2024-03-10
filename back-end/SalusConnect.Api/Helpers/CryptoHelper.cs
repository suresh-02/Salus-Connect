using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace SalusConnect.Api.Helpers;

public class CryptoHelper
{
    private const int AesKeySize = 16;

    public static string EncryptString(string text, string keyString)
    {
        var key = Encoding.UTF8.GetBytes(keyString);

        using (var aesAlg = Aes.Create())
        {
            using (var encryptor = aesAlg.CreateEncryptor(key, aesAlg.IV))
            {
                using (var msEncrypt = new MemoryStream())
                {
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    using (var swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(text);
                    }

                    var iv = aesAlg.IV;

                    var decryptedContent = msEncrypt.ToArray();

                    var result = new byte[iv.Length + decryptedContent.Length];

                    Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
                    Buffer.BlockCopy(decryptedContent, 0, result, iv.Length, decryptedContent.Length);

                    return Convert.ToBase64String(result);
                }
            }
        }
    }

    public static string DecryptString(string cipherText, string keyString)
    {
        var fullCipher = Convert.FromBase64String(cipherText);

        var iv = new byte[16];
        var cipher = new byte[16];

        Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
        Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, iv.Length);
        var key = Encoding.UTF8.GetBytes(keyString);

        using (var aesAlg = Aes.Create())
        {
            using (var decryptor = aesAlg.CreateDecryptor(key, iv))
            {
                string result;
                using (var msDecrypt = new MemoryStream(cipher))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (var srDecrypt = new StreamReader(csDecrypt))
                        {
                            result = srDecrypt.ReadToEnd();
                        }
                    }
                }

                return result;
            }
        }
    }

    public static string AesEncrypt(string data, string key)
    {
        return AesEncrypt(data, Encoding.UTF8.GetBytes(key));
    }

    public static string AesDecrypt(string data, string key)
    {
        return AesDecrypt(data, Encoding.UTF8.GetBytes(key));
    }

    private static string AesEncrypt(string data, byte[] key)
    {
        return Convert.ToBase64String(AesEncrypt(Encoding.UTF8.GetBytes(data), key));
    }

    private static string AesDecrypt(string data, byte[] key)
    {
        return Encoding.UTF8.GetString(AesDecrypt(Convert.FromBase64String(data), key));
    }

    private static byte[] AesEncrypt(byte[] data, byte[] key)
    {
        if (data is not { Length: > 0 })
        {
            throw new ArgumentNullException(nameof(data), "SalusConnect.AesEncrypt:Data cannot be empty");
        }

        if (key is not { Length: AesKeySize })
        {
            throw new ArgumentException($"Key must be length of {AesKeySize}.");
        }

        //using (var aes = new AesCryptoServiceProvider
        //{
        //    Key = key,
        //    Mode = CipherMode.CBC,
        //    Padding = PaddingMode.PKCS7
        //})
        using (var aes = Aes.Create())
        {
            aes.Key = key;
            aes.Mode = CipherMode.CBC;
            // ReSharper disable once BitwiseOperatorOnEnumWithoutFlags
            aes.Padding = PaddingMode.None | PaddingMode.PKCS7;

            aes.GenerateIV();
            var iv = aes.IV;
            using (var encryptor = aes.CreateEncryptor(aes.Key, iv))
            using (var cipherStream = new MemoryStream())
            {
                using (var tCryptoStream = new CryptoStream(cipherStream, encryptor, CryptoStreamMode.Write))
                using (var tBinaryWriter = new BinaryWriter(tCryptoStream))
                {
                    // prepend IV to data
                    cipherStream.Write(iv);
                    tBinaryWriter.Write(data);
                    tCryptoStream.FlushFinalBlock();
                }
                var cipherBytes = cipherStream.ToArray();

                return cipherBytes;
            }
        }
    }

    private static byte[] AesDecrypt(byte[] data, byte[] key)
    {
        if (data is not { Length: > 0 })
        {
            throw new ArgumentNullException(nameof(data), "AesEncrypt: Data cannot be empty");
        }

        if (key is not { Length: AesKeySize })
        {
            throw new ArgumentException($"Key must be length of {AesKeySize}.");
        }

        //using (var aes = new AesCryptoServiceProvider
        //{
        //    Key = key,
        //    Mode = CipherMode.CBC,
        //    Padding = PaddingMode.PKCS7
        //})
        using (var aes = Aes.Create())
        {
            aes.Key = key;
            aes.Mode = CipherMode.CBC;
            // ReSharper disable once BitwiseOperatorOnEnumWithoutFlags
            aes.Padding = PaddingMode.None | PaddingMode.PKCS7;

            // get first KeySize bytes of IV and use it to decrypt
            var iv = new byte[AesKeySize];
            Array.Copy(data, 0, iv, 0, iv.Length);

            using (var ms = new MemoryStream())
            {
                using (var cs = new CryptoStream(ms, aes.CreateDecryptor(aes.Key, iv), CryptoStreamMode.Write))
                using (var binaryWriter = new BinaryWriter(cs))
                {
                    // decrypt cipher text from data, starting just past the IV
                    binaryWriter.Write(
                        data,
                        iv.Length,
                        data.Length - iv.Length
                    );
                }

                var dataBytes = ms.ToArray();

                return dataBytes;
            }
        }
    }
}