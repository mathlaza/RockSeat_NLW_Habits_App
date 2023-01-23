import dayjs from "dayjs";
import * as Dialog from '@radix-ui/react-dialog';
import { NewHabitForm } from "./NewHabitForm";
import { X } from "phosphor-react";

interface IEmptyHabit {
  date: Date;
}

export function EmptyHabit({ date }: IEmptyHabit) {

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

  return (
    <div>
      {isDateInPast ?
        <div>Você não pode completar hábitos de uma data passada</div>
        :
        <div className="text-zinc-400 text-base text-center flex flex-col">
          Você ainda não está monitorando nenhum hábito, {''}
          <Dialog.Root>
            <Dialog.Trigger
              type="button"
              className="text-violet-400 text-base underline active:text-violet-500"
            >
              comece criando um!
            </Dialog.Trigger>

            <Dialog.Portal> {/* Joga o conteúdo modal pra fora da aplicação */}
              <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />
              <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Dialog.Close className="absolute right-6 top-6 text-zinc-400 rounded-lg hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-blackBackground">
                  <X
                    size={24}
                    aria-label="Fechar"
                    />
                </Dialog.Close>

                <Dialog.Title className="text-3xl leading-tight font-extrabold">
                  Criar hábito
                </Dialog.Title>

                <NewHabitForm />

              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      }
    </div>
  )
}