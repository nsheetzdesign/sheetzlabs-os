const BUCKET = "receipts";
export async function uploadReceipt(supabase, expenseId, file) {
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${expenseId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
    if (error)
        throw new Error(`Receipt upload failed: ${error.message}`);
    const { data: { publicUrl }, } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: publicUrl, filename: file.name };
}
export async function deleteReceipt(supabase, receiptUrl) {
    // Extract the path after /receipts/
    const marker = `/receipts/`;
    const idx = receiptUrl.indexOf(marker);
    if (idx === -1)
        return;
    const path = receiptUrl.slice(idx + marker.length);
    if (path) {
        await supabase.storage.from(BUCKET).remove([path]);
    }
}
