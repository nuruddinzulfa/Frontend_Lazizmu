import DonationForm from '../../components/donation/DonationForm'

interface DonasiPageWrapperProps {
  initialZakatAmount?: number
  initialProgram?: string
}

export default function DonasiPageWrapper({ initialZakatAmount, initialProgram }: DonasiPageWrapperProps) {
  return <DonationForm initialZakatAmount={initialZakatAmount} initialProgram={initialProgram} />
}
