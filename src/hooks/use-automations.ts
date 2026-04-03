
import { useMutationData } from "./use-mutation-data"
import { createAutomations } from "@/actions/automations"

export const useCreateAutomation = (id?: string) => {
    const {isPending, mutate} = useMutationData(
        ['create-automation'], 
        () => createAutomations(id),
        "user-automations"
    )

    return {isPending, mutate}
}