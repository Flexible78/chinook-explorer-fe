import { useQuery } from "@tanstack/react-query";
import type { Track } from "../../services/albums-service.js";
import TracksModal from "../ui/TracksModal.js";
import { getTrackRowKey, standardTrackColumns } from "../ui/trackTableColumns.js";

interface NamedEntity {
    id: number;
    name: string;
}

interface TrackCollectionModalProps<T extends NamedEntity> {
    entity: T | null;
    onClose: () => void;
    queryKeyBase: string;
    queryFn: (id: number) => Promise<Track[]>;
    fallbackTitle: string;
    errorMessage: string;
    makeTitle?: (entity: T) => string;
    pageSize?: number;
}

const TrackCollectionModal = <T extends NamedEntity>({
    entity,
    onClose,
    queryKeyBase,
    queryFn,
    fallbackTitle,
    errorMessage,
    makeTitle,
    pageSize,
}: TrackCollectionModalProps<T>) => {
    const entityId = entity?.id;

    const { data: tracks = [], isPending, error } = useQuery<Track[]>({
        queryKey: [queryKeyBase, entityId],
        queryFn: () => queryFn(entityId as number),
        enabled: entityId !== undefined,
    });

    const title = entity
        ? (makeTitle ? makeTitle(entity) : `${entity.name} — Tracks`)
        : fallbackTitle;

    return (
        <TracksModal
            isOpen={entity !== null}
            onClose={onClose}
            title={title}
            tracks={tracks}
            loading={isPending}
            columns={standardTrackColumns}
            getRowKey={getTrackRowKey}
            errorMessage={error ? errorMessage : null}
            pageSize={pageSize}
        />
    );
};

export default TrackCollectionModal;
