# BottomSheet - OBSOLÈTE

⚠️ **Ce composant est obsolète et ne doit plus être utilisé.**

## Migration

Tous les usages de ce composant ont été migrés vers la librairie [Vaul](https://vaul.emilkowal.ski/) qui offre :

- Un drag natif plus fluide
- Une meilleure performance
- Une API plus simple
- Un support mobile amélioré

## Utilisation de Vaul

```tsx
import { Drawer } from "vaul";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 z-50">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            {/* Votre contenu ici */}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

## Composants migrés

- ✅ FilterBottomSheet
- ✅ SearchBottomSheet
- ✅ TicketCard QR Code

## Suppression

Ce dossier peut être supprimé une fois que VS Code n'a plus de références actives au fichier.
