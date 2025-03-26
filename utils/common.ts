export default function formatList(list: { name: string }[]) {
    return list.map((item) => item.name).join(' / ');
}

export function generatePaginationData(
    currentPagination: number,
    totalCardNumber: number,
    currentPageCardsNumber: number = 4
) {
    const lastPagination = Math.ceil(totalCardNumber / currentPageCardsNumber);
    const firstPagination = 1;
    let arr = [];

    let leftSide = [];

    if (currentPagination - firstPagination > 3) {
        leftSide = [firstPagination, '...', currentPagination - 1];
    } else if (currentPagination - firstPagination < 3) {
        for (let i = firstPagination; i < currentPagination; i++) {
            leftSide.push(i);
        }
    } else {
        leftSide = [
            firstPagination,
            firstPagination + 1,
            currentPagination - 1,
        ];
    }

    let rightSide = [];
    if (lastPagination - currentPagination > 3) {
        rightSide = [currentPagination + 1, '...', lastPagination];
    } else if (lastPagination - currentPagination < 3) {
        for (let i = currentPagination + 1; i <= lastPagination; i++) {
            rightSide.push(i);
        }
    } else {
        rightSide = [
            currentPagination + 1,
            currentPagination + 2,
            lastPagination,
        ];
    }
    arr = [...leftSide, currentPagination, ...rightSide];
    return arr;
}
