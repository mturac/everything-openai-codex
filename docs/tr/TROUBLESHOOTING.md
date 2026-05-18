# Sorun Giderme Rehberi

Everything OpenAI Codex (ecc) eklentisi için yaygın sorunlar ve çözümler.

## İçindekiler

- [Bellek ve Context Sorunları](#bellek-ve-context-sorunları)
- [Ajan Harness Hataları](#ajan-harness-hataları)
- [Hook ve İş Akışı Hataları](#hook-ve-i̇ş-akışı-hataları)
- [Kurulum ve Yapılandırma](#kurulum-ve-yapılandırma)
- [Performans Sorunları](#performans-sorunları)
- [Yaygın Hata Mesajları](#yaygın-hata-mesajları)
- [Yardım Alma](#yardım-alma)

---

## Bellek ve Context Sorunları

### Context Window Taşması

**Belirti:** "Context too long" hataları veya eksik yanıtlar

**Nedenler:**
- Token limitlerini aşan büyük dosya yüklemeleri
- Birikmiş konuşma geçmişi
- Tek oturumda birden fazla büyük araç çıktısı

**Çözümler:**
```bash
# 1. Konuşma geçmişini temizle ve yeni başla
# OpenAI Codex kullan: "New Chat" veya Cmd/Ctrl+Shift+N

# 2. Analiz öncesi dosya boyutunu küçült
head -n 100 large-file.log > sample.log

# 3. Büyük çıktılar için streaming kullan
head -n 50 large-file.txt

# 4. Görevleri daha küçük parçalara böl
# Bunun yerine: "50 dosyanın hepsini analiz et"
# Kullan: "src/components/ dizinindeki dosyaları analiz et"
```

### Bellek Kalıcılığı Hataları

**Belirti:** Ajan önceki context veya gözlemleri hatırlamıyor

**Nedenler:**
- Devre dışı bırakılmış sürekli öğrenme hook'ları
- Bozuk gözlem dosyaları
- Proje algılama hataları

**Çözümler:**
```bash
# Gözlemlerin kaydedilip kaydedilmediğini kontrol et
ls ~/.codex/homunculus/projects/*/observations.jsonl

# Mevcut projenin hash id'sini bul
python3 - <<'PY'
import json, os
registry_path = os.path.expanduser("~/.codex/homunculus/projects.json")
with open(registry_path) as f:
    registry = json.load(f)
for project_id, meta in registry.items():
    if meta.get("root") == os.getcwd():
        print(project_id)
        break
else:
    raise SystemExit("Project hash not found in ~/.codex/homunculus/projects.json")
PY

# O proje için son gözlemleri görüntüle
tail -20 ~/.codex/homunculus/projects/<project-hash>/observations.jsonl

# Bozuk bir observations dosyasını yeniden oluşturmadan önce yedekle
mv ~/.codex/homunculus/projects/<project-hash>/observations.jsonl \
  ~/.codex/homunculus/projects/<project-hash>/observations.jsonl.bak.$(date +%Y%m%d-%H%M%S)

# Hook'ların etkin olduğunu doğrula
grep -r "observe" ~/.codex/settings.json
```

---

## Ajan Harness Hataları

### Ajan Bulunamadı

**Belirti:** "Agent not loaded" veya "Unknown agent" hataları

**Nedenler:**
- Eklenti doğru kurulmadı
- Ajan yolu yanlış yapılandırılmış
- Marketplace vs manuel kurulum uyumsuzluğu

**Çözümler:**
```bash
# Eklenti kurulumunu kontrol et
ls ~/.codex/plugins/cache/

# Ajanın var olduğunu doğrula (marketplace kurulumu)
ls ~/.codex/plugins/cache/*/agents/

# Manuel kurulum için ajanlar şurada olmalı:
ls ~/.codex/agents/  # Sadece özel ajanlar

# Eklentiyi yeniden yükle
# OpenAI Codex → Settings → Extensions → Reload
```

### İş Akışı Yürütmesi Takılıyor

**Belirti:** Ajan başlıyor ama hiç tamamlanmıyor

**Nedenler:**
- Ajan mantığında sonsuz döngüler
- Kullanıcı girdisinde takılı
- API'yi beklerken ağ zaman aşımı

**Çözümler:**
```bash
# 1. Takılı işlemleri kontrol et
ps aux | grep codex|ps aux | grep codex

# 2. Debug modunu etkinleştir
export CODEX_DEBUG=1

# 3. Daha kısa zaman aşımları ayarla
export CODEX_TIMEOUT=30

# 4. Ağ bağlantısını kontrol et
curl -I https://api.openai.com
```

### Araç Kullanım Hataları

**Belirti:** "Tool execution failed" veya izin reddedildi

**Nedenler:**
- Eksik bağımlılıklar (npm, python, vb.)
- Yetersiz dosya izinleri
- Yol bulunamadı

**Çözümler:**
```bash
# Gerekli araçların kurulu olduğunu doğrula
which node python3 npm git

# Hook scriptlerinin izinlerini düzelt
chmod +x ~/.codex/plugins/cache/*/hooks/*.sh
chmod +x ~/.codex/plugins/cache/*/skills/*/hooks/*.sh

# PATH'in gerekli binary'leri içerdiğini kontrol et
echo $PATH
```

---

## Hook ve İş Akışı Hataları

### Hook'lar Çalışmıyor

**Belirti:** Pre/post hook'lar çalışmıyor

**Nedenler:**
- Hook'lar settings.json'da kayıtlı değil
- Geçersiz hook sözdizimi
- Hook scripti çalıştırılabilir değil

**Çözümler:**
```bash
# Hook'ların kayıtlı olduğunu kontrol et
grep -A 10 '"hooks"' ~/.codex/settings.json

# Hook dosyalarının var olduğunu ve çalıştırılabilir olduğunu doğrula
ls -la ~/.codex/plugins/cache/*/hooks/

# Hook'u manuel olarak test et
bash ~/.codex/plugins/cache/*/hooks/pre-bash.sh <<< '{"command":"echo test"}'

# Hook'ları yeniden kaydet (eklenti kullanıyorsa)
# OpenAI Codex ayarlarında eklentiyi devre dışı bırak ve yeniden etkinleştir
```

### Python/Node Sürüm Uyumsuzlukları

**Belirti:** "python3 not found" veya "node: command not found"

**Nedenler:**
- Python/Node kurulumu eksik
- PATH yapılandırılmamış
- Yanlış Python sürümü (Windows)

**Çözümler:**
```bash
# Python 3'ü kur (eksikse)
# macOS: brew install python3
# Ubuntu: sudo apt install python3
# Windows: python.org'dan indir

# Node.js'i kur (eksikse)
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
# Windows: nodejs.org'dan indir

# Kurulumları doğrula
python3 --version
node --version
npm --version

# Windows: python'un (python3 değil) çalıştığından emin ol
python --version
```

### Dev Server Blocker Yanlış Pozitifleri

**Belirti:** Hook, "dev" içeren meşru komutları engelliyor

**Nedenler:**
- Heredoc içeriği pattern eşleşmesini tetikliyor
- Argümanlarda "dev" olan dev olmayan komutlar

**Çözümler:**
```bash
# Bu v1.8.0+'da düzeltildi (PR #371)
# Eklentiyi en son sürüme yükselt

# Geçici çözüm: Dev sunucularını tmux'ta sarmalayın
tmux new-session -d -s dev "npm run dev"
tmux attach -t dev

# Gerekirse hook'u geçici olarak devre dışı bırak
# ~/.codex/settings.json'u düzenle ve pre-bash hook'unu kaldır
```

---

## Kurulum ve Yapılandırma

### Eklenti Yüklenmiyor

**Belirti:** Kurulumdan sonra eklenti özellikleri kullanılamıyor

**Nedenler:**
- Marketplace önbelleği güncellenmedi
- OpenAI Codex sürüm uyumsuzluğu
- Bozuk eklenti dosyaları

**Çözümler:**
```bash
# Değiştirmeden önce eklenti önbelleğini incele
ls -la ~/.codex/plugins/cache/

# Silmek yerine eklenti önbelleğini yedekle
mv ~/.codex/plugins/cache ~/.codex/plugins/cache.backup.$(date +%Y%m%d-%H%M%S)
mkdir -p ~/.codex/plugins/cache

# Marketplace'ten yeniden kur
# OpenAI Codex → Extensions → Everything OpenAI Codex → Uninstall
# Ardından marketplace'ten yeniden kur

# OpenAI Codex sürümünü kontrol et
codex --version
# OpenAI Codex 2.0+ gerektirir

# Manuel kurulum (marketplace başarısız olursa)
git clone https://github.com/mturac/everything-openai-codex.git
cp -r Everything OpenAI Codex ~/.codex/plugins/ecc
```

### Paket Yöneticisi Algılama Başarısız

**Belirti:** Yanlış paket yöneticisi kullanılıyor (pnpm yerine npm)

**Nedenler:**
- Lock dosyası mevcut değil
- CODEX_PACKAGE_MANAGER ayarlanmamış
- Birden fazla lock dosyası algılamayı karıştırıyor

**Çözümler:**
```bash
# Tercih edilen paket yöneticisini global olarak ayarla
export CODEX_PACKAGE_MANAGER=pnpm
# ~/.bashrc veya ~/.zshrc'ye ekle

# Veya proje bazında ayarla
echo '{"packageManager": "pnpm"}' > .codex/package-manager.json

# Veya package.json alanını kullan
npm pkg set packageManager="pnpm@8.15.0"

# Uyarı: lock dosyalarını kaldırmak kurulu bağımlılık sürümlerini değiştirebilir.
# Önce lock dosyasını commit et veya yedekle, ardından yeni bir kurulum yap ve CI'ı yeniden çalıştır.
# Bunu sadece kasıtlı olarak paket yöneticilerini değiştirirken yap.
rm package-lock.json  # pnpm/yarn/bun kullanıyorsan
```

---

## Performans Sorunları

### Yavaş Yanıt Süreleri

**Belirti:** Ajan yanıt vermek için 30+ saniye sürüyor

**Nedenler:**
- Büyük gözlem dosyaları
- Çok fazla aktif hook
- API'ye ağ gecikmesi

**Çözümler:**
```bash
# Büyük gözlemleri silmek yerine arşivle
archive_dir="$HOME/.codex/homunculus/archive/$(date +%Y%m%d)"
mkdir -p "$archive_dir"
find ~/.codex/homunculus/projects -name "observations.jsonl" -size +10M -exec sh -c '
  for file do
    base=$(basename "$(dirname "$file")")
    gzip -c "$file" > "'"$archive_dir"'/${base}-observations.jsonl.gz"
    : > "$file"
  done
' sh {} +

# Kullanılmayan hook'ları geçici olarak devre dışı bırak
# ~/.codex/settings.json'u düzenle

# Aktif gözlem dosyalarını küçük tut
# Büyük arşivler ~/.codex/homunculus/archive/ altında olmalı
```

### Yüksek CPU Kullanımı

**Belirti:** OpenAI Codex %100 CPU tüketiyor

**Nedenler:**
- Sonsuz gözlem döngüleri
- Büyük dizinlerde dosya izleme
- Hook'larda bellek sızıntıları

**Çözümler:**
```bash
# Kontrolden çıkmış işlemleri kontrol et
top -o cpu | grep codex|ps aux | grep codex

# Sürekli öğrenmeyi geçici olarak devre dışı bırak
touch ~/.codex/homunculus/disabled

# OpenAI Codex'u yeniden başlat
# Cmd/Ctrl+Q ardından yeniden aç

# Gözlem dosyası boyutunu kontrol et
du -sh ~/.codex/homunculus/*/
```

---

## Yaygın Hata Mesajları

### "EACCES: permission denied"

```bash
# Hook izinlerini düzelt
find ~/.codex/plugins -name "*.sh" -exec chmod +x {} \;

# Gözlem dizini izinlerini düzelt
chmod -R u+rwX,go+rX ~/.codex/homunculus
```

### "MODULE_NOT_FOUND"

```bash
# Eklenti bağımlılıklarını kur
cd ~/.codex/plugins/cache/ecc
npm install

# Veya manuel kurulum için
cd ~/.codex/plugins/ecc
npm install
```

### "spawn UNKNOWN"

```bash
# Windows'a özgü: Scriptlerin doğru satır sonlarını kullandığından emin ol
# CRLF'yi LF'ye dönüştür
find ~/.codex/plugins -name "*.sh" -exec dos2unix {} \;

# Veya dos2unix'i kur
# macOS: brew install dos2unix
# Ubuntu: sudo apt install dos2unix
```

---

## Yardım Alma

Hala sorunlar yaşıyorsanız:

1. **GitHub Issues'ı Kontrol Edin**: [github.com/mturac/everything-openai-codex/issues](https://github.com/mturac/everything-openai-codex/issues)
2. **Debug Logging'i Etkinleştirin**:
   ```bash
   export CODEX_DEBUG=1
   export CODEX_LOG_LEVEL=debug
   ```
3. **Diagnostic Bilgisi Toplayın**:
   ```bash
   codex --version
   node --version
   python3 --version
   echo $CODEX_PACKAGE_MANAGER
   ls -la ~/.codex/plugins/cache/
   ```
4. **Issue Açın**: Debug loglarını, hata mesajlarını ve diagnostic bilgiyi dahil edin

---

## İlgili Dokümantasyon

- [README.md](./README.md) - Kurulum ve özellikler
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Geliştirme rehberleri
- [docs/](../) - Detaylı dokümantasyon
- [examples/](./examples/) - Kullanım örnekleri
