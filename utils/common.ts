export default function formatList(list: { name: string }[]) {
    return list.map((item) => item.name).join(' / ');
}
