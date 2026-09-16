import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import HomePage from './home-page.tsx'
import ThemeStudioPage from './pages/theme-studio-page.tsx'
import DashboardPage from './examples/dashboard-page.tsx'
import SettingsPage from './examples/settings-page.tsx'
import InboxPage from './examples/inbox-page.tsx'
import CheckoutPage from './examples/checkout-page.tsx'
import BoardPage from './examples/board-page.tsx'
import AuthPage from './examples/auth-page.tsx'
import PricingPage from './examples/pricing-page.tsx'
import QrCodePage from './pages/qr-code-page.tsx'
import CreditCardPage from './pages/credit-card-page.tsx'
import CreditCardFieldPage from './pages/credit-card-field-page.tsx'
import LineChartPage from './pages/line-chart-page.tsx'
import BarChartPage from './pages/bar-chart-page.tsx'
import DonutChartPage from './pages/donut-chart-page.tsx'
import BarListPage from './pages/bar-list-page.tsx'
import SparklinePage from './pages/sparkline-page.tsx'
import StatPage from './pages/stat-page.tsx'
import AppLayout from './app-layout.tsx'
import ButtonPage from './pages/button-page.tsx'
import IconButtonPage from './pages/icon-button-page.tsx'
import SwitchPage from './pages/switch-page.tsx'
import TextFieldPage from './pages/text-field-page.tsx'
import CheckboxPage from './pages/checkbox-page.tsx'
import RadioGroupPage from './pages/radio-group-page.tsx'
import SelectPage from './pages/select-page.tsx'
import TextareaPage from './pages/textarea-page.tsx'
import DialogPage from './pages/dialog-page.tsx'
import TooltipPage from './pages/tooltip-page.tsx'
import TabsPage from './pages/tabs-page.tsx'
import BadgePage from './pages/badge-page.tsx'
import SeparatorPage from './pages/separator-page.tsx'
import DropdownMenuPage from './pages/dropdown-menu-page.tsx'
import PopoverPage from './pages/popover-page.tsx'
import AlertDialogPage from './pages/alert-dialog-page.tsx'
import ToastPage from './pages/toast-page.tsx'
import AccordionPage from './pages/accordion-page.tsx'
import AlertPage from './pages/alert-page.tsx'
import AvatarPage from './pages/avatar-page.tsx'
import CardPage from './pages/card-page.tsx'
import KbdPage from './pages/kbd-page.tsx'
import PaginationPage from './pages/pagination-page.tsx'
import ProgressPage from './pages/progress-page.tsx'
import SegmentedControlPage from './pages/segmented-control-page.tsx'
import SkeletonPage from './pages/skeleton-page.tsx'
import SliderPage from './pages/slider-page.tsx'
import SpinnerPage from './pages/spinner-page.tsx'
import ComboboxPage from './pages/combobox-page.tsx'
import SheetPage from './pages/sheet-page.tsx'
import TablePage from './pages/table-page.tsx'
import BreadcrumbPage from './pages/breadcrumb-page.tsx'
import NumberFieldPage from './pages/number-field-page.tsx'
import TogglePage from './pages/toggle-page.tsx'
import EmptyStatePage from './pages/empty-state-page.tsx'
import CommandPalettePage from './pages/command-palette-page.tsx'
import DatePickerPage from './pages/date-picker-page.tsx'
import MultiSelectPage from './pages/multi-select-page.tsx'
import FileUploadPage from './pages/file-upload-page.tsx'
import OtpInputPage from './pages/otp-input-page.tsx'
import CopyButtonPage from './pages/copy-button-page.tsx'
import LinkPage from './pages/link-page.tsx'
import CollapsiblePage from './pages/collapsible-page.tsx'
import DescriptionListPage from './pages/description-list-page.tsx'
import HoverCardPage from './pages/hover-card-page.tsx'
import ContextMenuPage from './pages/context-menu-page.tsx'
import StepperPage from './pages/stepper-page.tsx'
import SidebarPage from './pages/sidebar-page.tsx'
import CarouselPage from './pages/carousel-page.tsx'
import ResizablePage from './pages/resizable-page.tsx'
import ButtonGroupPage from './pages/button-group-page.tsx'
import DateRangePickerPage from './pages/date-range-picker-page.tsx'
import TimePickerPage from './pages/time-picker-page.tsx'
import TreeViewPage from './pages/tree-view-page.tsx'
import TimelinePage from './pages/timeline-page.tsx'
import RatingPage from './pages/rating-page.tsx'
import ColorPickerPage from './pages/color-picker-page.tsx'
import ScrollAreaPage from './pages/scroll-area-page.tsx'
import AspectRatioPage from './pages/aspect-ratio-page.tsx'
import PasswordFieldPage from './pages/password-field-page.tsx'
import SearchFieldPage from './pages/search-field-page.tsx'
import TagInputPage from './pages/tag-input-page.tsx'
import RangeSliderPage from './pages/range-slider-page.tsx'
import InlineEditPage from './pages/inline-edit-page.tsx'
import FieldsetPage from './pages/fieldset-page.tsx'
import ToolbarPage from './pages/toolbar-page.tsx'
import BannerPage from './pages/banner-page.tsx'
import TagPage from './pages/tag-page.tsx'
import AvatarGroupPage from './pages/avatar-group-page.tsx'
import CodeBlockPage from './pages/code-block-page.tsx'

const rootRoute = createRootRoute({
  component: AppLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const buttonRoute = createRoute({ getParentRoute: () => rootRoute, path: '/button', component: ButtonPage })
const iconButtonRoute = createRoute({ getParentRoute: () => rootRoute, path: '/icon-button', component: IconButtonPage })
const switchRoute = createRoute({ getParentRoute: () => rootRoute, path: '/switch', component: SwitchPage })
const textFieldRoute = createRoute({ getParentRoute: () => rootRoute, path: '/text-field', component: TextFieldPage })

const checkboxRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkbox', component: CheckboxPage })
const radioGroupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/radio-group', component: RadioGroupPage })

const selectRoute = createRoute({ getParentRoute: () => rootRoute, path: '/select', component: SelectPage })
const textareaRoute = createRoute({ getParentRoute: () => rootRoute, path: '/textarea', component: TextareaPage })
const dialogRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dialog', component: DialogPage })
const tooltipRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tooltip', component: TooltipPage })

const tabsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tabs', component: TabsPage })
const badgeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/badge', component: BadgePage })
const separatorRoute = createRoute({ getParentRoute: () => rootRoute, path: '/separator', component: SeparatorPage })

const dropdownMenuRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dropdown-menu', component: DropdownMenuPage })
const popoverRoute = createRoute({ getParentRoute: () => rootRoute, path: '/popover', component: PopoverPage })

const alertDialogRoute = createRoute({ getParentRoute: () => rootRoute, path: '/alert-dialog', component: AlertDialogPage })
const toastRoute = createRoute({ getParentRoute: () => rootRoute, path: '/toast', component: ToastPage })
const accordionRoute = createRoute({ getParentRoute: () => rootRoute, path: '/accordion', component: AccordionPage })

const alertRoute = createRoute({ getParentRoute: () => rootRoute, path: '/alert', component: AlertPage })
const avatarRoute = createRoute({ getParentRoute: () => rootRoute, path: '/avatar', component: AvatarPage })
const cardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/card', component: CardPage })
const kbdRoute = createRoute({ getParentRoute: () => rootRoute, path: '/kbd', component: KbdPage })
const paginationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pagination', component: PaginationPage })
const progressRoute = createRoute({ getParentRoute: () => rootRoute, path: '/progress', component: ProgressPage })
const segmentedControlRoute = createRoute({ getParentRoute: () => rootRoute, path: '/segmented-control', component: SegmentedControlPage })
const skeletonRoute = createRoute({ getParentRoute: () => rootRoute, path: '/skeleton', component: SkeletonPage })
const sliderRoute = createRoute({ getParentRoute: () => rootRoute, path: '/slider', component: SliderPage })
const spinnerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/spinner', component: SpinnerPage })

const comboboxRoute = createRoute({ getParentRoute: () => rootRoute, path: '/combobox', component: ComboboxPage })
const sheetRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sheet', component: SheetPage })
const tableRoute = createRoute({ getParentRoute: () => rootRoute, path: '/table', component: TablePage })
const breadcrumbRoute = createRoute({ getParentRoute: () => rootRoute, path: '/breadcrumb', component: BreadcrumbPage })
const numberFieldRoute = createRoute({ getParentRoute: () => rootRoute, path: '/number-field', component: NumberFieldPage })
const toggleRoute = createRoute({ getParentRoute: () => rootRoute, path: '/toggle', component: TogglePage })
const emptyStateRoute = createRoute({ getParentRoute: () => rootRoute, path: '/empty-state', component: EmptyStatePage })

const commandPaletteRoute = createRoute({ getParentRoute: () => rootRoute, path: '/command-palette', component: CommandPalettePage })
const datePickerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/date-picker', component: DatePickerPage })
const multiSelectRoute = createRoute({ getParentRoute: () => rootRoute, path: '/multi-select', component: MultiSelectPage })
const fileUploadRoute = createRoute({ getParentRoute: () => rootRoute, path: '/file-upload', component: FileUploadPage })
const otpInputRoute = createRoute({ getParentRoute: () => rootRoute, path: '/otp-input', component: OtpInputPage })
const copyButtonRoute = createRoute({ getParentRoute: () => rootRoute, path: '/copy-button', component: CopyButtonPage })
const linkRoute = createRoute({ getParentRoute: () => rootRoute, path: '/link', component: LinkPage })
const collapsibleRoute = createRoute({ getParentRoute: () => rootRoute, path: '/collapsible', component: CollapsiblePage })
const descriptionListRoute = createRoute({ getParentRoute: () => rootRoute, path: '/description-list', component: DescriptionListPage })
const hoverCardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/hover-card', component: HoverCardPage })
const contextMenuRoute = createRoute({ getParentRoute: () => rootRoute, path: '/context-menu', component: ContextMenuPage })
const stepperRoute = createRoute({ getParentRoute: () => rootRoute, path: '/stepper', component: StepperPage })
const sidebarRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sidebar', component: SidebarPage })
const carouselRoute = createRoute({ getParentRoute: () => rootRoute, path: '/carousel', component: CarouselPage })
const resizableRoute = createRoute({ getParentRoute: () => rootRoute, path: '/resizable', component: ResizablePage })

const buttonGroupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/button-group', component: ButtonGroupPage })
const dateRangePickerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/date-range-picker', component: DateRangePickerPage })
const timePickerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/time-picker', component: TimePickerPage })
const treeViewRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tree-view', component: TreeViewPage })
const timelineRoute = createRoute({ getParentRoute: () => rootRoute, path: '/timeline', component: TimelinePage })
const ratingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/rating', component: RatingPage })
const colorPickerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/color-picker', component: ColorPickerPage })
const scrollAreaRoute = createRoute({ getParentRoute: () => rootRoute, path: '/scroll-area', component: ScrollAreaPage })
const aspectRatioRoute = createRoute({ getParentRoute: () => rootRoute, path: '/aspect-ratio', component: AspectRatioPage })

const passwordFieldRoute = createRoute({ getParentRoute: () => rootRoute, path: '/password-field', component: PasswordFieldPage })
const searchFieldRoute = createRoute({ getParentRoute: () => rootRoute, path: '/search-field', component: SearchFieldPage })
const tagInputRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tag-input', component: TagInputPage })
const rangeSliderRoute = createRoute({ getParentRoute: () => rootRoute, path: '/range-slider', component: RangeSliderPage })
const inlineEditRoute = createRoute({ getParentRoute: () => rootRoute, path: '/inline-edit', component: InlineEditPage })
const fieldsetRoute = createRoute({ getParentRoute: () => rootRoute, path: '/fieldset', component: FieldsetPage })
const toolbarRoute = createRoute({ getParentRoute: () => rootRoute, path: '/toolbar', component: ToolbarPage })
const bannerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/banner', component: BannerPage })
const tagRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tag', component: TagPage })
const avatarGroupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/avatar-group', component: AvatarGroupPage })
const codeBlockRoute = createRoute({ getParentRoute: () => rootRoute, path: '/code-block', component: CodeBlockPage })

const themeStudioRoute = createRoute({ getParentRoute: () => rootRoute, path: '/theme-studio', component: ThemeStudioPage })

const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/examples/dashboard', component: DashboardPage })
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/examples/settings', component: SettingsPage })
const inboxRoute = createRoute({ getParentRoute: () => rootRoute, path: '/examples/inbox', component: InboxPage })
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/examples/checkout', component: CheckoutPage })
const boardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/examples/board', component: BoardPage })
const authRoute = createRoute({ getParentRoute: () => rootRoute, path: '/examples/auth', component: AuthPage })
const creditCardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/credit-card', component: CreditCardPage })
const creditCardFieldRoute = createRoute({ getParentRoute: () => rootRoute, path: '/credit-card-field', component: CreditCardFieldPage })
const qrCodeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/qr-code', component: QrCodePage })
const pricingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/examples/pricing', component: PricingPage })
const lineChartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/line-chart', component: LineChartPage })
const barChartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/bar-chart', component: BarChartPage })
const donutChartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/donut-chart', component: DonutChartPage })
const barListRoute = createRoute({ getParentRoute: () => rootRoute, path: '/bar-list', component: BarListPage })
const sparklineRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sparkline', component: SparklinePage })
const statRoute = createRoute({ getParentRoute: () => rootRoute, path: '/stat', component: StatPage })

const routeTree = rootRoute.addChildren([indexRoute, lineChartRoute, barChartRoute, donutChartRoute, barListRoute, sparklineRoute, statRoute, themeStudioRoute, dashboardRoute, settingsRoute, inboxRoute, checkoutRoute, boardRoute, authRoute, pricingRoute, qrCodeRoute, creditCardRoute, creditCardFieldRoute, buttonRoute, iconButtonRoute, switchRoute, textFieldRoute, checkboxRoute, radioGroupRoute, selectRoute, textareaRoute, dialogRoute, tooltipRoute, tabsRoute, badgeRoute, separatorRoute, dropdownMenuRoute, popoverRoute, alertDialogRoute, toastRoute, accordionRoute, alertRoute, avatarRoute, cardRoute, kbdRoute, paginationRoute, progressRoute, segmentedControlRoute, skeletonRoute, sliderRoute, spinnerRoute, comboboxRoute, sheetRoute, tableRoute, breadcrumbRoute, numberFieldRoute, toggleRoute, emptyStateRoute, commandPaletteRoute, datePickerRoute, multiSelectRoute, fileUploadRoute, otpInputRoute, copyButtonRoute, linkRoute, collapsibleRoute, descriptionListRoute, hoverCardRoute, contextMenuRoute, stepperRoute, sidebarRoute, carouselRoute, resizableRoute, buttonGroupRoute, dateRangePickerRoute, timePickerRoute, treeViewRoute, timelineRoute, ratingRoute, colorPickerRoute, scrollAreaRoute, aspectRatioRoute, passwordFieldRoute, searchFieldRoute, tagInputRoute, rangeSliderRoute, inlineEditRoute, fieldsetRoute, toolbarRoute, bannerRoute, tagRoute, avatarGroupRoute, codeBlockRoute])

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router
