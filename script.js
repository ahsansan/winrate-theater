const secretKey = "BelalangYangMembangkang";

function decrypt(ciphertext) {
    const base64 = ciphertext.replace(/-/g, '+').replace(/_/g, '/');
    return CryptoJS.AES.decrypt(base64, secretKey).toString(CryptoJS.enc.Utf8);
}

function getDateWithMinute(timeString) {
    const time = new Date(timeString);
    const month = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const weekday = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
    ];

    const dayIndex = time.getDay();
    const date = time.getDate();
    const monthIndex = time.getMonth();
    const year = time.getFullYear();
    const hour = time.getHours();
    const min = time.getMinutes();

    const result = `${weekday[dayIndex]}, ${date} ${month[monthIndex]} ${year} Jam ${hour}:${min} WIB`;

    return result;
}

const urlParams = new URLSearchParams(window.location.search);
const encryptedResult = urlParams.get('result');

if (encryptedResult) {
    try {
        const decryptedResult = decrypt(encryptedResult);
        const data = JSON.parse(decryptedResult);
        const nameContainer = document.getElementById('name-container');
        nameContainer.innerText = `Data Winrate Theater ${data.name}`;

        const dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = '';

        let totalApply = 0;
        let totalMenang = 0;
        let totalKalah = 0;
        let totalTunggu = 0;

        data.data.sort((a, b) => b.winrate - a.winrate);

        data.data.forEach(setlist => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 border border-[#fdd9e8] text-sm">${setlist.setlist_name}</td>
                <td class="px-6 py-4 border border-[#fdd9e8] text-sm">${setlist.total}</td>
                <td class="px-6 py-4 border border-[#fdd9e8] text-sm">${setlist.menang}</td>
                <td class="px-6 py-4 border border-[#fdd9e8] text-sm">${setlist.kalah}</td>
                <td class="px-6 py-4 border border-[#fdd9e8] text-sm">${setlist.winrate}%</td>
            `;
            dataContainer.appendChild(row);

            totalApply += setlist.total;
            totalTunggu += setlist.tunggu;
            totalMenang += setlist.menang;
            totalKalah += setlist.kalah;
        });

        const validGacha = totalApply - totalTunggu;
        const overallWinrate = ((totalMenang / validGacha) * 100).toFixed(2);

        const summaryContainer = document.getElementById('summary-container');
        summaryContainer.innerHTML = `
            <p class="text-sm">Total Apply: <span class="font-bold ml-1">${totalApply}</span></p>
            <p class="text-sm">Menunggu Pengumuman: <span class="font-bold ml-1">${totalTunggu}</span></p>
            <p class="text-sm">Total Kemenangan: <span class="font-bold ml-1">${totalMenang}</span></p>
            <p class="text-sm">Total Kekalahan: <span class="font-bold ml-1">${totalKalah}</span></p>
            <p class="text-sm">Winrate Keseluruhan: <span class="font-bold ml-1">${overallWinrate}%</span></p>
        `;

        const lastUpdateElement = document.getElementById('last-update');
        const lastUpdate = data.lastUpdate;

        lastUpdateElement.innerText = getDateWithMinute(lastUpdate);

    } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById('name-container').innerText = 'Gagal memproses data JSON.';
    }
} else {
    document.getElementById('name-container').innerText = 'Tidak ada parameter result yang ditemukan.';
}